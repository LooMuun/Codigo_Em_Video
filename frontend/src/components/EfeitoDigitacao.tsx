import { useState, useEffect } from "react";

interface EfeitoDigitacaoProps {
    texto: string;
    velocidade?: number; // Tempo em milissegundos entre cada letra
}

const EfeitoDigitacao = ({ texto, velocidade = 20 }: EfeitoDigitacaoProps) => {
    const [textoExibido, setTextoExibido] = useState("");

    useEffect(() => {
        let i = 0;
        setTextoExibido(""); // Reseta o texto ao iniciar

        const timer = setInterval(() => {
            if (i < texto.length) {
                // Pega o caractere atual e atualiza o estado usando a função de callback
                // para garantir que o React não perca nenhuma letra no re-render
                setTextoExibido((prev) => prev + texto.charAt(i));
                i++;
            } else {
                clearInterval(timer); // Limpa o timer quando o texto acabar
            }
        }, velocidade);

        return () => clearInterval(timer);
    }, [texto, velocidade]);

    return <p>{textoExibido}</p>;
};

export default EfeitoDigitacao;