use cosmwasm_schema::cw_serde;
use cosmwasm_std::Env;

use crate::error::ContractError;

#[cw_serde]
#[derive(Default)]
pub struct Point {
    x: u8,
    y: u8,
}

impl Point {
    pub fn new(x: u8, y: u8) -> Self {
        Self { x, y }
    }
    pub fn update(&mut self, int: u8) {
        self.x = int / 3;
        self.y = int % 3;
    }
}

#[cw_serde]
#[derive(Default)]
pub struct Board {
    pub positions: [[u8; 3]; 3],
}

impl Board {
    pub fn set(&mut self, x: u8, y: u8, player: u8) {
        self.positions[x as usize][y as usize] = player;
    }

    /// Returns the winner
    pub(crate) fn x_win(&self) -> Option<u8> {
        for x in self.positions.iter() {
            let winner = x[0];
            if winner == x[1] && winner == x[2] {
                if winner != 0 {
                    return Some(winner);
                }
            }
        }
        None
    }

    pub(crate) fn y_win(&self) -> Option<u8> {
        for y in 0..3 {
            let winner = self.positions[0][y];
            if winner == self.positions[1][y] && winner == self.positions[2][y] {
                if winner != 0 {
                    return Some(winner);
                }
            }
        }
        None
    }

    pub(crate) fn diag_win(&self) -> Option<u8> {
        let winner = self.positions[1][1];
        if (winner == self.positions[0][0] && winner == self.positions[2][2])
            || (winner == self.positions[2][0] && winner == self.positions[0][2])
        {
            if winner != 0 {
                return Some(winner);
            }
        }
        None
    }

    pub fn won_by(&self) -> Option<u8> {
        self.x_win().or(self.y_win().or(self.diag_win()))
    }
}

#[cw_serde]
pub enum GameStatus {
    InProgress,
    Won(u8),
    Draw,
}

#[cw_serde]
pub struct Game {
    pub board: Board,
    pub total_moves: u8,
    pub next_player: u8,
    pub status: GameStatus,
    pub last_position: [u8; 2],
}

impl Game {
    pub fn new() -> Self {
        Self {
            board: Board::default(),
            total_moves: 0,
            next_player: 1,
            status: GameStatus::InProgress,
            last_position: [3, 3],
        }
    }

    pub fn is_playable(&self) -> bool {
        match self.status {
            GameStatus::InProgress => true,
            _ => false,
        }
    }

    pub fn play(&mut self, position: Option<Point>, env: Env) -> Result<(), ContractError> {
        if let Some(p) = position {
            self.check_is_empty(&self.board, &p)?;
            self.board.set(p.x, p.y, self.next_player);
            self.last_position = [p.x, p.y];
        } else {
            let p = self.play_psuedo_random(env);
            self.board.set(p.x, p.y, self.next_player);
            self.last_position = [p.x, p.y];
        }
        self.total_moves = self.total_moves + 1;
        self.next_player = self.next_player % 2 + 1;
        self.check_win_or_full();
        Ok(())
    }

    fn check_is_empty(&self, board: &Board, point: &Point) -> Result<(), ContractError> {
        if board.positions[point.x as usize][point.y as usize] != 0 {
            Err(ContractError::PositionTaken)
        } else {
            Ok(())
        }
    }

    /// This is just a "fake" randomness part for autoplay
    fn play_psuedo_random(&self, env: Env) -> Point {
        let mut point = Point::default();
        let seed = env.block.time.seconds();
        let mut int = (seed % 9) as u8;
        point.update(int);
        while self.check_is_empty(&self.board, &point).is_err() {
            int = (int + 1) % 9;
            point.update(int);
        }
        point
    }

    /// This should be called after any moves
    fn check_win_or_full(&mut self) {
        if let Some(winner) = self.board.won_by() {
            self.status = GameStatus::Won(winner)
        } else {
            // No one won but all boxes have been filled
            if self.total_moves == 9 {
                self.status = GameStatus::Draw
            }
        }
    }
}
