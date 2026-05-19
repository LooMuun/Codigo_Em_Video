import { useState, useEffect } from "react";

interface EfeitoDigitacaoProps {
  texto: string;
  velocidade?: number;
}

const EfeitoDigitacao = ({ texto, velocidade = 20 }: EfeitoDigitacaoProps) => {
  const [textoExibido, setTextoExibido] = useState("");

  useEffect(() => {
    let i = 0;
    setTextoExibido("");

    const timer = setInterval(() => {
      if (i < texto.length) {
        setTextoExibido((prev) => prev + texto.charAt(i));
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
