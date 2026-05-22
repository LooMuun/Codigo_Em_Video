import { useState, useEffect } from "react";

interface EfeitoDigitacaoProps {
  texto: string;
  velocidade?: number;
}

const EfeitoDigitacao = ({ texto, velocidade = 20 }: EfeitoDigitacaoProps) => {
  const [textoExibido, setTextoExibido] = useState("");

  useEffect(() => {
    let i = 0;

    const timer = setInterval(() => {
      if (i < texto.length) {
        setTextoExibido(texto.slice(0, i + 1)); /*Mudei do Prev pro Slice pq tava engolindo letras*/
        i++;
      } else {
        clearInterval(timer);
      }
    }, velocidade);

    return () => clearInterval(timer);
  }, [texto, velocidade]);

  return <p>{textoExibido}</p>;
};

export default EfeitoDigitacao;