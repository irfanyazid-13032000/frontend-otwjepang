import '../assets/css/score.css';

export default function Score({gameOver}) {


  return (
    <div className={`papanScore ${gameOver == true  ?'block':'none'}`}>
      <p className='gameOver'>Game Over</p>

      <p className='score'>Your Score : 20</p>

      <p className='highestScore'>Highest Score : 90</p>

      <button className='tryAgain'>Try Again</button>
      
    </div>
  )
  
  
}