from datetime import datetime
from team_registration import Team, Draft, StrategyStats


def make_strategy_set(base_rank: int):
    strategies = [
        ("strat_sniper", 23, 7, 2, 1, 125),
        ("strat_plague", 21, 6, 3, 1, 165),
        ("strat_power_rush", 15, 5, 0, 5, 109),
        ("strat_hoarder", 12, 4, 0, 6, 143),
        ("strat_random", 12, 4, 0, 6, 110),
        ("strat_neighbor", 3, 0, 3, 7, 32),
    ]

    result = {}

    for i, (name, pts, w, d, l, nodes) in enumerate(strategies):
        result[name] = StrategyStats(
            strategy=name,
            rank=base_rank + i,
            points=pts,
            wins=w,
            draws=d,
            losses=l,
            total_nodes=nodes,
            matches=10,
        )

    return result


def make_draft(title: str, base_rank: int):
    return Draft(
        strategy_name=title,
        strategy_desc=f"{title} aggressive expansion logic",
        code="print('hello world')",
        tournament_result=make_strategy_set(base_rank),
    )


def get_dummy_teams():
    now = datetime.utcnow()

    return [
        Team(
            team_name="Vikram",
            mode="SOLO",
            members=["uid_vikram"],
            created_at=now,
            finalized_strategy="draft_1",
            drafts={
                "draft_1": make_draft("sniper_v1", 1),
                "draft_2": make_draft("sniper_v2", 2),
            },
        ),
        Team(
            team_name="Rameez",
            mode="DUO",
            members=["uid_rameez", "uid_rahul"],
            created_at=now,
            finalized_strategy="draft_2",
            drafts={
                "draft_1": make_draft("plague_v1", 1),
                "draft_2": make_draft("plague_v2", 3),
            },
        ),
        Team(
            team_name="Kavin",
            mode="SOLO",
            members=["uid_kavin"],
            created_at=now,
            finalized_strategy=None,
            drafts={
                "draft_1": make_draft("rush_v1", 2),
                "draft_2": make_draft("rush_v2", 4),
            },
        ),
        Team(
            team_name="Sanjay",
            mode="DUO",
            members=["uid_sanjay", "uid_amit"],
            created_at=now,
            finalized_strategy="draft_1",
            drafts={
                "draft_1": make_draft("hoarder_v1", 3),
                "draft_2": make_draft("hoarder_v2", 5),
            },
        ),
        Team(
            team_name="Siddharth",
            mode="SOLO",
            members=["uid_sid"],
            created_at=now,
            finalized_strategy=None,
            drafts={
                "draft_1": make_draft("random_v1", 4),
                "draft_2": make_draft("random_v2", 6),
            },
        ),
    ]
