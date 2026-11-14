"""Bounded in-memory journal; deliberately not advertised as durable."""
from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from threading import RLock


@dataclass
class ObservationJournal:
    max_events: int = 300
    _events: deque[dict[str, object]] = field(default_factory=deque)
    _lock: RLock = field(default_factory=RLock)

    def append(self, channel: str, value: float, unit: str, source: str) -> dict[str, object]:
        with self._lock:
            event = {
                "id": len(self._events) + 1,
                "recorded_at": datetime.now(timezone.utc).isoformat(),
                "channel": channel,
                "value": value,
                "unit": unit,
                "source": source,
            }
            self._events.append(event)
            while len(self._events) > self.max_events:
                self._events.popleft()
            return dict(event)

    def latest(self, limit: int = 50) -> list[dict[str, object]]:
        with self._lock:
            return [dict(item) for item in list(self._events)[-limit:][::-1]]
