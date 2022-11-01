import styled from "styled-components";
import { useEffect, useState } from 'react';
import gatito from './gatito.png'

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {

  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(-2)

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if(gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE){
      timeId = setInterval(() =>{
        setBirdPosition(birdPosition => birdPosition + GRAVITY)
      }, 24)
    }

    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId
    if(gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH){
      obstacleId = setInterval(() =>{
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5)
      },24)

      return () => {
        clearInterval(obstacleId);
      }
    }else {
      setObstacleLeft(GAME_WIDTH -OBSTACLE_WIDTH)
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
        );
        setScore(score => score + 1)
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollideWithTopObstacle = 
    birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollideWithBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

    if(obstacleLeft >= 0 && 
      obstacleLeft <= OBSTACLE_WIDTH && 
      (hasCollideWithTopObstacle || hasCollideWithBottomObstacle)
      ){
      setGameHasStarted(false)
    }
  },[birdPosition, obstacleHeight, bottomObstacleHeight ,obstacleLeft])

  

  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if(!gameHasStarted){
      setGameHasStarted(true);
    }
    else if(newBirdPosition < 0) {
      setBirdPosition(0)
    }else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle 
        top={0}
        width={OBSTACLE_WIDTH}
        height={obstacleHeight}
        left={obstacleLeft}
        />

        <Obstacle 
        top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
        width={OBSTACLE_WIDTH}
        height={bottomObstacleHeight}
        left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition}  ><img src={gatito} alt="" /></Bird>
      </GameBox>
      <span> {score} </span>
    </Div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
  && img{
    width:50px
    
  }
  
`

const Div = styled.div`
display: flex;
width: 100%;
height: 100vh;
justify-content: center;
background-image: url("https://images7.alphacoders.com/104/1041091.jpg");
background-repeat: no-repeat, repeat;
background-size: cover;
}
& span{
  color: white;
  font-size: 24px;
  position: absolute;
}
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-image: url("https://i.pinimg.com/736x/e7/0c/60/e70c60aa37d3ea91af0558e7bb3305c1.jpg");
  overflow: hidden;
`;
const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left ${(props) => props.left}px;
`;
