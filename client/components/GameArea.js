import firebase from 'firebase'
import {connect} from 'react-redux';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import React, {Component} from 'react';
import {getUserPlayerNum} from '../vanillaUtils'
import {
  BlurOnRoundOver,
  GameEndModal,
  GameField,
  PlayerArea,
} from '../components';
import {
  tellReduxImLoading,
  tellReduxImDoneLoading,
} from '../redux/reduxUtils';
import { resetReduxForStartedDbGameInstance } from '../firebase'
const db = firebase.database()


class GameArea extends Component {

  constructor(props) {
    super(props)
    this.leftColumnPlayers = [];
    this.rightColumnPlayers = [];
    this.topRowPlayers = [];
  }

  componentWillMount () {
    const {game} = this.props;
    const gameRef = db.ref(`games/${this.props.match.params.gameId}`)
    if (!game.isInProgress) {

      tellReduxImLoading();
      return resetReduxForStartedDbGameInstance(gameRef)
      .then(() => setTimeout(tellReduxImDoneLoading(), 0))
      .catch(console.error.bind(console));
    }
  }

  renderLeftColumnPlayers(playerNums) {
    if (!playerNums.length) return null;
    return playerNums.map(playerNum => {
      return <PlayerArea key={playerNum} playerNum={playerNum} side="left" />
    })
  }

  renderRightColumnPlayers(playerNums) {
    if (!playerNums.length) return null;
    return playerNums.map(playerNum => {
      return <PlayerArea key={playerNum} playerNum={playerNum} side="right" />
    })
  }

  renderTopRowPlayers(playerNums) {
    if (!playerNums.length) return null;
    return playerNums.map(playerNum => {
      return <PlayerArea key={playerNum} playerNum={playerNum} side="top" />
    })
  }

  sortPlayersNumsIntoAreas(players) {
    const areas = {top: [], left: [], right: []};
    players.forEach(num => {
      if (num % 2 !== 0) {
        areas.left.length >= areas.right.length
          ? areas.right.push(num)
          : areas.left.push(num);
      } else {
        areas.top.push(num);
      }
    })
    return areas;
  }

  render() {
    const {userPlayerNum, otherPlayerNums} = this.props;
    if (!otherPlayerNums.length) return null;
    console.log('otherPlayerNums', otherPlayerNums);

    const areas = this.sortPlayersNumsIntoAreas(otherPlayerNums)


    return (
        <div className="game-area-wrapper">
        <BlurOnRoundOver >

          <div id="gameArea" className="game-area">

{/* ------------------ COLUMN ONE -------------------------- */}
            <div className="player-area-stacked-container">
              {this.renderTopRowPlayers(areas.top)}
            </div>

            <div className="player-area-stacked-container">
                {this.renderLeftColumnPlayers(areas.left)}
            </div>

            <div className="player-area-stacked-container">
               {this.renderRightColumnPlayers(areas.right)}
            </div>

{/* ------------------- COLUMN TWO --------------------------- */}
            <div className="game-field-stacked-container">

              <div className="game-field-container">
                <GameField />
              </div>

            </div>

{/* --------------------- COLUMN THREE --------------------------- */}

            <div className="player-area-stacked-container">
              <PlayerArea playerNum={userPlayerNum} side="bottom" />
            </div>

          </div>
          </BlurOnRoundOver>
        <GameEndModal />
        </div>
      )
  }
}

function mapStateToProps (state) {
  return {
    game: state.game,
    user: state.user,
    userPlayerNum: state.game.userPlayerNum,
    otherPlayerNums: Object.keys(state.players).filter(num => +num !== +state.game.userPlayerNum).map(num => +num),
    isRoundOver: state.game.isNertzCalled,
  }
}


const reduxifiedGameArea = connect(mapStateToProps)(GameArea);
export default DragDropContext(HTML5Backend)(reduxifiedGameArea)

