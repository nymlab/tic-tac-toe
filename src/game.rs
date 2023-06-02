use cosmwasm_schema::cw_serde;
use cosmwasm_std::Env;

use crate::error::ContractError;

#[cw_serde]
#[derive(Default)]
pub struct Point {
    x: usize,
    y: usize,
}

impl Point {
    pub fn update(&mut self, int: usize) {
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
    /// Returns the winner
    fn x_win(&self) -> Option<u8> {
        for x in self.positions.iter() {
            let winner = x[0];
            if winner == x[1] && winner == x[2] {
                return Some(winner);
            }
        }
        None
    }

    fn y_win(&self) -> Option<u8> {
        for y in 0..3 {
            let winner = self.positions[y][0];
            if winner == self.positions[y][1] && winner == self.positions[y][2] {
                return Some(winner);
            }
        }
        None
    }

    fn diag_win(&self) -> Option<u8> {
        let winner = self.positions[1][1];
        if (winner == self.positions[0][0] && winner == self.positions[2][2])
            || (winner == self.positions[3][0] && winner == self.positions[0][2])
        {
            return Some(winner);
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
}

impl Game {
    pub fn new() -> Self {
        Self {
            board: Board::default(),
            total_moves: 0,
            next_player: 1,
            status: GameStatus::InProgress,
        }
    }

    pub fn play(&mut self, position: Option<Point>, env: Env) -> Result<(), ContractError> {
        if self.total_moves == 9 {
            return Err(ContractError::Full);
        }
        if let Some(p) = position {
            self.check_is_empty(&self.board, &p)?;
            self.board.positions[p.x][p.y] = self.next_player;
        } else {
            let p = self.play_psuedo_random(&self.board, env);
            self.board.positions[p.x][p.y] = self.next_player;
        }
        self.total_moves = self.total_moves + 1;
        self.next_player = self.next_player % 2 + 1;
        self.check_win_or_full();
        Ok(())
    }

    fn check_is_empty(&self, board: &Board, point: &Point) -> Result<(), ContractError> {
        if board.positions[point.x][point.y] != 0 {
            Err(ContractError::PositionTaken)
        } else {
            Ok(())
        }
    }

    /// This is just a "fake" randomness part for autoplay
    fn play_psuedo_random(&self, board: &Board, env: Env) -> Point {
        let mut point = Point::default();
        let seed = env.block.time.seconds();
        let mut int = (seed % 9) as usize;
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
            if self.total_moves == 9 {
                self.status = GameStatus::Draw
            }
        }
    }
}
