"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-navy">
      Imprimir o guardar PDF
    </button>
  );
}
