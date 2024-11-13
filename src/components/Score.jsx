import '../assets/css/score.css';



export default function Score({gameOver, tryAgain, listScore, sudahDijawab}) {

  
  return (
    <div className={`papanScore ${gameOver == true  ?'block':'none'}`}>
      <p className='gameOver'>Game Over</p>

      <p className='score'>Your Score : {sudahDijawab}</p>

      <p className='highestScore'>Highest Score : {Math.max(...listScore)}</p>

      <button className='tryAgain' onClick={tryAgain}>Try Again</button>
      
    </div>
  )
  
  
}