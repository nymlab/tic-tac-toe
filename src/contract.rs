use crate::error::ContractError;
use crate::game::*;
use cosmwasm_std::{Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use cw_storage_plus::{Item, Map};
use sylvia::contract;

const CONTRACT_NAME: &str = env!("CARGO_PKG_NAME");
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

pub struct TicTacToe<'a> {
    pub games: Map<'a, &'a str, Game>,
    pub total_games: Item<'a, u64>,
}

#[contract]
impl TicTacToe<'_> {
    pub const fn new() -> Self {
        Self {
            games: Map::new("games"),
            total_games: Item::new("total_games"),
        }
    }

    #[msg(instantiate)]
    pub fn instantiate(&self, ctx: (DepsMut, Env, MessageInfo)) -> Result<Response, ContractError> {
        let (deps, _, _) = ctx;
        set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
        self.total_games.save(deps.storage, &0)?;
        Ok(Response::new())
    }

    #[msg(exec)]
    pub fn new_game(&self, ctx: (DepsMut, Env, MessageInfo)) -> Result<Response, ContractError> {
        let (deps, _, info) = ctx;
        let game = Game::new();
        self.games.save(deps.storage, info.sender.as_str(), &game)?;
        self.total_games
            .update(deps.storage, |total| -> Result<u64, ContractError> {
                Ok(total + 1)
            })?;
        Ok(Response::new())
    }

    #[msg(exec)]
    pub fn play(
        &self,
        ctx: (DepsMut, Env, MessageInfo),
        point: Option<Point>,
    ) -> Result<Response, ContractError> {
        let (deps, env, info) = ctx;
        let mut game = self.games.load(deps.storage, info.sender.as_str())?;
        if game.is_playable() {
            game.play(point, env)?;
            self.games.save(deps.storage, info.sender.as_str(), &game)?;
            Ok(Response::new())
        } else {
            Err(ContractError::Completed)
        }
    }

    #[msg(query)]
    pub fn game_info(&self, ctx: (Deps, Env), owner: String) -> StdResult<Game> {
        let (deps, _) = ctx;
        self.games.load(deps.storage, &owner)
    }

    #[msg(query)]
    pub fn total_games(&self, ctx: (Deps, Env)) -> StdResult<u64> {
        let (deps, _) = ctx;
        self.total_games.load(deps.storage)
    }
}
