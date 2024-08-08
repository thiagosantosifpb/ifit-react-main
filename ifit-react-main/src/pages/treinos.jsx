import React, { useRef, useState, useEffect } from 'react';
import logo from '../imgs/logo.png';
import { Link } from 'react-router-dom';
import '../style/treinos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnvajrohqoobgbonfurp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudmFqcm9ocW9vYmdib25mdXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyOTc4MTcsImV4cCI6MjAxNDg3MzgxN30.zd0sfXxI_22rI5oJ8FXLLMvisu23V4ZYPHUrGNt4MhE';

const supabase = createClient(supabaseUrl, supabaseKey);

function Treinos() {
  const partesDoCorpo = ['Tórax, Ombro ou Tríceps', 'Costas, Abdômen ou Bíceps', 'Parte Inferior, Pernas ou Glúteo'];


  const lesaoRef = useRef(null);
  const objetivoRef = useRef(null);
  const disponibilidadeRef = useRef(null);
  const localRef = useRef(null);
  const idadeRef = useRef(null);
  const botaoRef = useRef(null);

  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19[0-9]{2}|200[0-9]|201[0-9]|202[0-3])$/;

  const validacao_idade = () => {
    const input = idadeRef.current.value;
    if (regex.test(input)) {
      botaoRef.current.style.display = 'block';
    } else {
      botaoRef.current.style.display = 'none';
      window.alert('ERRO! Você precisa digitar a data de nascimento no formato "DD/MM/AAAA"');
    }
  };

  const gerarParteTrabalhada = (disponibilidade, lesao) => {
    let partes = [];
    let i = 0;
    while (partes.length < disponibilidade) {
      let parte = partesDoCorpo[i % partesDoCorpo.length];
      if (parte !== lesao) {
        partes.push(parte);
      }
      i++;
    }
    return partes;
  };

  const selecionarExerciciosAleatorios = (exercicios, quantidade) => {
    let selecionados = [];
    while (selecionados.length < quantidade && exercicios.length > 0) {
      let indice = Math.floor(Math.random() * exercicios.length);
      selecionados.push(exercicios[indice]);
      exercicios.splice(indice, 1);
    }
    return selecionados;
  };

  const [treinos, setTreinos] = useState([]);
  const [diaAtual, setDiaAtual] = useState(0);

  const montarTreinos = async () => {
      let { data: exerciciosData, error } = await supabase
        .from('exercicios')
        .select('*');
  
      console.log('Data dos exercícios:', exerciciosData);
  
      if (error) {
        throw error;
      }
  
      if (!exerciciosData || exerciciosData.length === 0) {
        console.log('Não há dados de exercícios disponíveis para criar treinos.');
        return;
      }
  
      let exerciciosPorParte = {};
      exerciciosData.forEach(exercicio => {
        const parte = exercicio.parte;
        if (!exerciciosPorParte[parte]) {
          exerciciosPorParte[parte] = [];
        }
        exerciciosPorParte[parte].push(exercicio);
      });

      let partesTrabalhadas = gerarParteTrabalhada(disponibilidadeRef.current.value, lesaoRef.current.value);
      let treinos = [];

      for (let parte of partesTrabalhadas) {
        let possiveisExercicios = selecionarExerciciosAleatorios(exerciciosPorParte[parte], 6);
      
        if (possiveisExercicios.length === 0) {
          console.log(`Não há exercícios disponíveis para ${parte} com o objetivo ${objetivoRef.current.value} no local ${localRef.current.value}.`);
          continue;
        }
      
        let exerciciosSelecionados = selecionarExerciciosAleatorios(possiveisExercicios, Math.min(possiveisExercicios.length, 6 + Math.floor(Math.random() * 3)));
      
        treinos.push({
          parteDoCorpo: parte,
          exercicios: exerciciosSelecionados
        });
      }      

      setTreinos(treinos);
  }

  const handleCriarTreino = async () => {
    try {
      await montarTreinos();
      const infoTreinosDiv = document.getElementById('infoTreinos');
      infoTreinosDiv.style.display = 'block'; 
    } catch (error) {
      console.error('Erro ao criar o treino:', error);
    }
  };
  

  const mostrarDia = (dia) => {
    if (!treinos || !Array.isArray(treinos) || treinos.length === 0) {
      console.error('Não há treinos para exibir!');
      return;
    }
  
    if (dia >= treinos.length) {
      diaAtual = 0;
      dia = 0;
    }
  
    if (dia < 0) {
      diaAtual = treinos.length - 1;
      dia = treinos.length - 1;
    }
  
    const treinosList = document.getElementById('treinos');
    treinosList.innerHTML = '';
  
    const navegacao = document.getElementById('navegacao');
    navegacao.style.display = 'block';
  
    const treinoItem = document.createElement('div');
    treinoItem.className = 'treino';
  
    const parteDoCorpo = document.createElement('h2');
    parteDoCorpo.textContent = `Dia ${dia + 1}: ${treinos[dia].parteDoCorpo}`;
    treinoItem.appendChild(parteDoCorpo);
  
    for (let exercicio of treinos[dia].exercicios) {
      const exercicioDiv = document.createElement('div');
  
      const exercicioNome = document.createElement('span');
      exercicioNome.className = 'exercicio';
      exercicioNome.textContent = exercicio.nome;
  
      const detalhesDiv = document.createElement('div');
      detalhesDiv.className = 'detalhes';
      detalhesDiv.innerHTML = `${exercicio.series} séries - ${exercicio.repeticoes} repetições`;
      detalhesDiv.style.display = 'none';
  
      exercicioNome.addEventListener('click', function () {
        detalhesDiv.style.display = detalhesDiv.style.display === 'none' ? 'block' : 'none';
      });
  
      exercicioDiv.appendChild(exercicioNome);
      exercicioDiv.appendChild(detalhesDiv);
  
      treinoItem.appendChild(exercicioDiv);
    }
  
    treinosList.appendChild(treinoItem);
  
    const infoCaracteristicas = document.getElementById('infoCaracteristicas');
    infoCaracteristicas.style.display = 'none';
  };
  

  const handleClickDiaAnterior = () => {
    setDiaAtual((prevDia) => (prevDia === 0 ? treinos.length - 1 : prevDia - 1));
  };
  
  const handleClickProximoDia = () => {
    setDiaAtual((prevDia) => (prevDia === treinos.length - 1 ? 0 : prevDia + 1));
  };
  
  useEffect(() => {
    mostrarDia(diaAtual);
  }, [diaAtual, treinos]);

  return (
    <main className='treinos'>
      <header>
        <Link to="/">
          <img className='imgtreinos' src={logo} alt="Home" />
        </Link>
      </header>
      <h1>Crie seu próprio treino</h1>

      <section className="secaotreinos" id="infoCaracteristicas">
        <div id="linha_1_caracter" className="linhas">
          <div>
            <p>Altura (cm)</p>
            <input id="altura" type="number" placeholder="XYZ"/>
          </div>
          <div>
            <p>Peso (kg)</p>
            <input id="peso" type="number" placeholder="XYZ"/>
          </div>
          <div>
            <p>Nascimento</p>
            <input id="idade" type="text" ref={idadeRef} onBlur={validacao_idade} placeholder="DD/MM/AAAA"/>
          </div>
        </div>
  
        <div id="linha_2_caracter" className="linhas">
        <div>
            <p>Gênero</p>
            <select defaultValue="none">
              <option value="none" disabled hidden>Seleção</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
          </div>
          <div>
            <p>Lesão</p>
            <select ref={lesaoRef} defaultValue="none">
              <option value="none" disabled hidden>Seleção</option>
              <option value="não">Nunca tive uma lesão</option>
              <option value="Tórax, Ombro ou Tríceps">Tórax, Ombro e Tríceps</option>
              <option value="Costas, Abdômen ou Bíceps">Costas, Abdômen e Bíceps</option>
              <option value="Parte Inferior, Pernas ou Glúteo">Parte Inferior, Pernas e Glúteo</option>
            </select>
          </div>
          <div>
            <p>Objetivo</p>
            <select ref={objetivoRef} defaultValue="none">
              <option value="none" disabled hidden>Seleção</option>
              <option value="Criar massa muscular">Criar massa muscular</option>
              <option value="Emagrecer">Emagrecer</option>
              <option value="Melhorar a saúde">Melhorar a saúde</option>
            </select>
          </div>
        </div>
  
        <div id="linha_3_caracter" className="linhas">
          <div>
            <p>Disponibilidade</p>
            <select ref={disponibilidadeRef} defaultValue="none">
              <option value="none" disabled hidden>Seleção</option>
              <option value="2">Posso treinar 2 vezes na semana</option>
              <option value="3">Posso treinar 3 vezes na semana</option>
              <option value="4">Posso treinar 4 vezes na semana</option>
              <option value="5">Posso treinar 5 vezes na semana</option>
              <option value="6">Posso treinar 6 vezes na semana</option>
              <option value="7">Posso treinar 7 vezes na semana</option>
            </select>
          </div>
        </div>
  
        <div id="linha_4_caracter" className="linhas">
          <div>
            <p>Local de treino</p>
            <select ref={localRef} defaultValue="none">
              <option value="none" disabled hidden>Seleção</option>
              <option value="Academia">Na academia</option>
              <option value="Em casa">Em casa, parques ou sem o máquinário da academia</option>
            </select>
          </div>
        </div>
  
        <div id="linha_5_caracter" className="linhas">
        <button ref={botaoRef} style={{ display: 'none' }} id="montarTreino" onClick={handleCriarTreino}>Criar treino</button>
        </div>
        </section>

        <section className="secaotreinos" id="infoTreinos">
        <div id="navegacao">
        <FontAwesomeIcon className='seta' icon={faArrowLeft} onClick={handleClickDiaAnterior} />
        <FontAwesomeIcon className='seta' icon={faArrowRight} onClick={handleClickProximoDia} />
        </div>
        <div id="treinos"></div>
      </section>
      </main>
  );
}

export default Treinos;