import React from 'react';
import '../assets/css/sumbangan.css';

export default function Sumbangan({ sumbangan, setSumbangan }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Teks berhasil disalin!"))
      .catch(() => alert("Gagal menyalin teks"));
  };

  const closeSumbangan = () => {
    setSumbangan(false)
  }

  return (
    <div className={`papanSumbangan ${sumbangan === true ? "block" : "none"}`}>
      <div className="ucapan">
        <p className='ajakan'>Bantu aku untuk bayar server yuk!!</p>
        <a href="https://saweria.co/yazidcengeng" className='saweria' target='_blank' rel='noopener noreferrer'>saweria</a>
        <p className='rekening'>Gopay : 089680810704 <span className="copy-icon" onClick={() => copyToClipboard("089680810704")}>📋</span></p>
        <p className='rekening'>Dana : 089680810704 <span className="copy-icon" onClick={() => copyToClipboard("089680810704")}>📋</span></p>
        <p className='rekening'>Mandiri : 1270012742969 A.N Irfaan Yaziid <span className="copy-icon" onClick={() => copyToClipboard("1270012742969")}>📋</span></p>
        <p className='rekening'>BCA : 6105294666 A.N Irfaan Yaziid <span className="copy-icon" onClick={() => copyToClipboard("6105294666")}>📋</span></p>
        <p className='x' onClick={closeSumbangan}>X</p>
      </div>
    </div>
  );
}
