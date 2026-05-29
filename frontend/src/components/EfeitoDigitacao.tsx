import { useState, useEffect } from "react";
import MessageRenderer from "./MessageRenderer";

interface EfeitoDigitacaoProps {
  texto: string;
  velocidade?: number;
}

const EfeitoDigitacao = ({ texto, velocidade = 10 }: EfeitoDigitacaoProps) => {
  const [textoExibido, setTextoExibido] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    setTextoExibido("");
    setIsComplete(false);

    const timer = setInterval(() => {
      if (i < texto.length) {
        setTextoExibido(texto.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, velocidade);

    return () => clearInterval(timer);
  }, [texto, velocidade]);

  if (isComplete) {
    return <MessageRenderer content={texto} />;
  }

  return <MessageRenderer content={textoExibido} />;
};

export default EfeitoDigitacao;