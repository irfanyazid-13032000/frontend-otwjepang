
import '../assets/css/card.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoal } from '../slices/soalSlice';

export default function Card(){
  const { data, loading, error } = useSelector((state) => state.soal);
  const [soalNo,setSoalNo] = useState(0);
    // State untuk melacak soal dan kelas tombol yang diklik
    const [clicked, setClicked] = useState(false);
    const [soalKanji,setSoalKanji] = useState('');
    const [pilihanGanda,setPilihanGanda] = useState([])
    const [acakData,setAcakData] = useState([])

  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSoal());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && data && data.length > 0) {
      setAcakData([...data].sort(()=> 0.5 - Math.random()))
      buatSoal(); // Panggil buatSoal setelah data tersedia
    }
  }, [data, loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  function buatSoal(){


    const kanjiText = acakData && acakData[soalNo] ? acakData[soalNo].kanji.teks_kanji : "Data tidak tersedia";
    setSoalKanji(kanjiText)
    const arti = acakData && acakData[soalNo] ? acakData[soalNo].arti.teks_arti : "Data tidak tersedia";
  
   // Mengumpulkan teks_arti dari setiap objek di array data
    const teksArtiPilihanGanda = data.map(item => item.arti.teks_arti);
  
  // Membuat salinan tanpa elemen 'perpustakaan'
    const teksArtiTanpaJawabanSebenarnya = teksArtiPilihanGanda.filter(teks => teks !== arti);
  
  // Mengacak array hasil filter dan mengambil 3 elemen pertama
    const acakTigaArti = teksArtiTanpaJawabanSebenarnya
      .sort(() => 0.5 - Math.random()) // Mengacak array
      .slice(0, 3); // Mengambil 3 elemen pertama
  
  
  // Menambahkan objek arti dengan status 'benar' ke dalam array
    const result = [
        ...acakTigaArti.map(teks => ({
          value: teks,
          status: false,
          class:'salah' // Bisa diganti sesuai kebutuhan
        })),
        { value: arti, status: true, class:'benar' }
      ];
  
  
  // Mengacak seluruh array (termasuk arti yang baru ditambahkan)
    const finalResult = result.sort(() => 0.5 - Math.random());
    setPilihanGanda(finalResult)
  }




const nextSoal = (status) => {

  setClicked(true); 

  setTimeout(() => {
    if (status == true) {
      setSoalNo(soalNo + 1);
      setTimeout(() => {
        buatSoal()
        setClicked(false)
      }, 1);
    } else {
      setSoalNo(soalNo);
      setClicked(false)
    }
  }, 500); 
};




  return (
    <>
      <div className="tampah">
        <div className="bar">
          <table>
            <thead>
            <tr>
              <td>❤️❤️❤</td>
              <td>soal: {soalNo}</td>
              <td>0:0:20</td>
            </tr>
            </thead>
          </table>
        </div>
        <div className="kanji">
          <p className='tulisan_kanji'>{soalKanji}</p>
          <p className='pertanyaan'>apa arti dari kanji tersebut?</p>
        </div>
        <div className="pilihan">
          {pilihanGanda.map((item,index)=>(
            <button key={index} className={clicked == true ? item.class : ''}  onClick={() => nextSoal(item.status)}>{item.value}</button>
          ))}
        </div>
      </div>
    </>
  )
}