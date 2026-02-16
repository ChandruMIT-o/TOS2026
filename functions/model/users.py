from dataclasses import dataclass, asdict
from typing import Dict, Literal, Optional
from datetime import datetime


UserRole = Literal["PARTICIPANT", "ADMIN"]

@dataclass
class User:
    uid: str
    name: str
    email: str
    phone: str
    institute: str
    year: int
    role: UserRole

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    def to_firestore(self) -> Dict:
        data = asdict(self)

        # Remove None so Firestore can use SERVER_TIMESTAMP
        return {k: v for k, v in data.items() if v is not None}
