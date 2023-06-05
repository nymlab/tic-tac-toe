use crate::{contract::TicTacToe, error::ContractError, game::*};
use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

const PLAYER1: &str = "player1";

#[test]
fn board_finds_x_wins() {
    let board1 = Board {
        positions: [[1, 1, 1], [0, 0, 0], [0, 0, 0]],
    };
    let board2 = Board {
        positions: [[1, 0, 1], [1, 1, 1], [1, 0, 0]],
    };
    let board3 = Board {
        positions: [[1, 0, 1], [1, 0, 1], [1, 1, 1]],
    };
    let board4 = Board {
        positions: [[1, 0, 1], [1, 0, 1], [1, 0, 0]],
    };
    let board5 = Board {
        positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    };
    assert_eq!(board1.x_win(), Some(1));
    assert_eq!(board2.x_win(), Some(1));
    assert_eq!(board3.x_win(), Some(1));
    assert_eq!(board4.x_win(), None);
    assert_eq!(board5.x_win(), None);
}

#[test]
fn board_finds_y_wins() {
    let board1 = Board {
        positions: [[1, 1, 0], [1, 0, 0], [1, 0, 0]],
    };
    let board2 = Board {
        positions: [[1, 2, 1], [1, 2, 1], [0, 2, 0]],
    };
    let board3 = Board {
        positions: [[1, 0, 2], [1, 0, 2], [0, 1, 2]],
    };
    let board4 = Board {
        positions: [[2, 0, 1], [1, 0, 1], [0, 0, 0]],
    };
    let board5 = Board {
        positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    };

    assert_eq!(board1.y_win(), Some(1));
    assert_eq!(board2.y_win(), Some(2));
    assert_eq!(board3.y_win(), Some(2));
    assert_eq!(board4.y_win(), None);
    assert_eq!(board5.y_win(), None);
}

#[test]
fn board_finds_dia_wins() {
    let board1 = Board {
        positions: [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
    };
    let board2 = Board {
        positions: [[1, 2, 2], [1, 2, 1], [2, 2, 0]],
    };
    let board3 = Board {
        positions: [[1, 0, 2], [1, 0, 2], [0, 1, 2]],
    };
    let board4 = Board {
        positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    };

    assert_eq!(board1.diag_win(), Some(1));
    assert_eq!(board2.diag_win(), Some(2));
    assert_eq!(board3.diag_win(), None);
    assert_eq!(board4.diag_win(), None);
}

#[test]
fn board_finds_wins() {
    // dia
    let board1 = Board {
        positions: [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
    };
    // y
    let board2 = Board {
        positions: [[1, 2, 1], [1, 2, 1], [0, 2, 0]],
    };
    // x
    let board3 = Board {
        positions: [[1, 0, 1], [2, 0, 2], [1, 1, 1]],
    };
    let board4 = Board {
        positions: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    };
    // None
    let board5 = Board {
        positions: [[1, 0, 1], [2, 0, 2], [2, 1, 1]],
    };

    assert_eq!(board1.won_by(), Some(1));
    assert_eq!(board2.won_by(), Some(2));
    assert_eq!(board3.won_by(), Some(1));
    assert_eq!(board4.won_by(), None);
    assert_eq!(board5.won_by(), None);
}

#[test]
fn board_play_on_empty_position_works() {
    let env = mock_env();
    let board1 = Board {
        positions: [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
    };
    let mut game = Game {
        board: board1,
        total_moves: 0,
        next_player: 2,
        status: GameStatus::InProgress,
        last_position: [0, 0],
    };

    game.play(Some(Point::new(2, 0)), env).unwrap();
    assert_eq!(game.board.positions[2][0], 2);
    assert_eq!(game.last_position, [2, 0]);
}

#[test]
fn game_play_on_occupied_position_fails_to_work() {
    let env = mock_env();
    let board1 = Board {
        positions: [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
    };
    let mut game = Game {
        board: board1,
        total_moves: 0,
        next_player: 2,
        status: GameStatus::InProgress,
        last_position: [0, 0],
    };

    let err = game.play(Some(Point::new(0, 0)), env).unwrap_err();
    assert_eq!(err, ContractError::PositionTaken)
}

#[test]
fn game_random_finds_empty_position_to_play() {
    let env = mock_env();
    let board1 = Board {
        positions: [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
    };
    let mut game = Game {
        board: board1,
        total_moves: 0,
        next_player: 2,
        status: GameStatus::InProgress,
        last_position: [0, 0],
    };

    game.play(None, env).unwrap();
    assert_eq!(game.next_player, 1);
    assert_eq!(game.total_moves, 1);
    assert_ne!(game.last_position, [0, 0]);
    let new_position = game.last_position;
    assert_eq!(
        game.board.positions[new_position[0] as usize][new_position[1] as usize],
        2
    );
}

#[test]
fn new_game_creates_board_for_user() {
    let mut deps = mock_dependencies();
    let info = mock_info(PLAYER1, &[]);
    let env = mock_env();

    let ttt = TicTacToe::new();
    ttt.instantiate((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();
    ttt.new_game((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();
    let game = ttt
        .game_info((deps.as_ref(), env.clone()), PLAYER1.to_string())
        .unwrap();
    let total = ttt.total_games((deps.as_ref(), env)).unwrap();

    assert_eq!(total, 1);
    assert_eq!(game.total_moves, 0);
    assert_eq!(game.next_player, 1);
    assert_eq!(game.status, GameStatus::InProgress);
}

#[test]
fn game_play_wins_returns_status() {
    let mut deps = mock_dependencies();
    let info = mock_info(PLAYER1, &[]);
    let env = mock_env();

    let ttt = TicTacToe::new();
    ttt.instantiate((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();
    ttt.new_game((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();

    let mut points = vec![];
    points.push(Point::new(1, 1));
    points.push(Point::new(1, 2));
    points.push(Point::new(0, 0));
    points.push(Point::new(1, 0));
    points.push(Point::new(2, 2));

    for point in points.iter() {
        ttt.play(
            (deps.as_mut(), env.clone(), info.clone()),
            Some(point.clone()),
        )
        .unwrap();
    }

    assert_eq!(
        ttt.game_info((deps.as_ref(), env), PLAYER1.to_string())
            .unwrap()
            .status,
        GameStatus::Won(1)
    )
}

#[test]
fn game_human_turn_cannot_be_played_by_auto() {
    let mut deps = mock_dependencies();
    let info = mock_info(PLAYER1, &[]);
    let env = mock_env();

    let ttt = TicTacToe::new();
    ttt.instantiate((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();
    ttt.new_game((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();

    let game = ttt
        .game_info((deps.as_ref(), env.clone()), PLAYER1.to_string())
        .unwrap();
    assert_eq!(game.next_player, 1);
    let err = ttt.play((deps.as_mut(), env, info), None).unwrap_err();

    assert_eq!(err, ContractError::NotAutoPlay)
}

#[test]
fn game_play_draw_returns_right_status() {
    let mut deps = mock_dependencies();
    let info = mock_info(PLAYER1, &[]);
    let env = mock_env();

    let ttt = TicTacToe::new();
    ttt.instantiate((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();
    ttt.new_game((deps.as_mut(), env.clone(), info.clone()))
        .unwrap();

    let mut points = vec![];
    // xox
    // oxo
    // oxo
    points.push(Point::new(1, 0));
    points.push(Point::new(0, 0));
    points.push(Point::new(0, 1));
    points.push(Point::new(2, 0));
    points.push(Point::new(2, 1));
    points.push(Point::new(1, 1));
    points.push(Point::new(0, 2));
    points.push(Point::new(1, 2));
    points.push(Point::new(2, 2));

    for point in points.iter() {
        ttt.play(
            (deps.as_mut(), env.clone(), info.clone()),
            Some(point.clone()),
        )
        .unwrap();
    }

    assert_eq!(
        ttt.game_info((deps.as_ref(), env), PLAYER1.to_string())
            .unwrap()
            .status,
        GameStatus::Draw
    )
}
