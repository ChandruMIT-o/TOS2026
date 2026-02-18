from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime


@dataclass
class StrategyStats:
    strategy: str
    rank: int
    points: int
    wins: int
    draws: int
    losses: int
    total_nodes: int
    matches: int


@dataclass
class Draft:
    strategy_name: Optional[str]
    strategy_desc: Optional[str]
    code: Optional[str]
    tournament_result: Dict[str, StrategyStats]


@dataclass
class Team:
    team_name: str
    mode: str
    members: List[str]
    created_at: datetime
    finalized_strategy: Optional[str]
    drafts: Dict[str, Draft]
