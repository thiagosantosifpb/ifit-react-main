import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../imgs/logo.png';
import slider1 from '../imgs/slider.png';
import slider2 from '../imgs/slider 2.jpg';
import slider3 from '../imgs/slider 3.jpg';
import mascote from '../imgs/Mascote.png';
import unidade3 from '../imgs/unidade 3.png';
import '../style/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("mensal");
  const [price, setPrice] = useState("Selecione um plano");

  const imageSlides = [slider1, slider2, slider3];
  const circles = [0, 1, 2];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleCircleClick = (index) => {
    setCurrentIndex(index);
  };

  const planos = [
    { nome: "Plano Mensal", preco: "R$30/mês" },
    { nome: "Plano Trimestral", preco: "R$80/trimestre" },
    { nome: "Plano Semestral", preco: "R$150/semestre" },
    { nome: "Plano Anual", preco: "R$280/ano" }
  ];

  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    setSelectedPlan(selectedPlan);

    const filteredPlan = planos.filter(plan => plan.nome.toLowerCase().includes(selectedPlan));
    const price = filteredPlan.reduce((total, plan) => total + plan.preco, "");

    setPrice(price);
  };

  const createPlanCard = (plan) => {
    return (
      <div className="plan-card" key={plan.nome}>
        <h3>{plan.nome}</h3>
        <p>{plan.preco}</p>
        <img src={mascote} alt="Mascote" id='mascote'/>
      </div>
    );
  };

  const filteredPlan = planos.filter(plan => plan.nome.toLowerCase().includes(selectedPlan));
  const planCards = filteredPlan.map(createPlanCard);

  return (
        <div>
            <header className='headerhome'>
                <div className="logo">
                    <img src={logo} alt="IFIT" className="logo-img" />
                </div>
                <nav className='navhome'>
                    <ul>
                        <li><a href="#home">HOME</a></li>
                        <li><a href="#nossa-academia">NOSSA ACADEMIA</a></li>
                        <li><Link to="/treinos">SEU TREINO</Link></li>
                        <li><a href="#planos">PLANOS</a></li>
                        <li><a href="#contato">CONTATO</a></li>
                    </ul>
                </nav>
            </header>
  
            <section className="secaohome" id="home">
        <div className="image-carousel">
          {imageSlides.map((slide, index) => (
            <div className={index === currentIndex ? "image-slide active" : "image-slide"} key={index}>
              <img src={slide} alt={`Imagem ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="navigation">
          {circles.map((_, index) => (
            <div className={index === currentIndex ? "circle active" : "circle"} key={index} onClick={() => handleCircleClick(index)}></div>
          ))}
        </div>
      </section>
  
        <section className="secaohome" id="nossa-academia">
          <div id="nossaacademiatexto">
            <h2 className='h2home'>Nossa Academia</h2>
            <p>Bem-vindo à nossa academia! Somos dedicados a ajudá-lo a alcançar seus objetivos de condicionamento físico e saúde. Nossa equipe de treinadores experientes e instalações de última geração estão aqui para apoiar sua jornada de fitness.</p>
          </div>
          <div id="mascote">
            <img src={mascote} alt="Mascote" />
          </div>
        </section>
  
        <section className="secaohome" id="local">
        <h2 className='h2home'> Conheça Nossas Localizações</h2>
  
          <div className="card-container">
          <div className="card">
                <img src="https://blog.nextfit.com.br/wp-content/uploads/2022/07/treino-perna.jpg" alt="Imagem 1" />
                <p> Av. Hilton Souto Maior, S/N - Mangabeira, João Pessoa - PB, 58055-018</p>
              </div>
              <div className="card">
                <img src="https://tecnofit-site.s3.sa-east-1.amazonaws.com/media/files/2023/03/22115409/aparelho-de-academia-barra-guiada.png" alt="Imagem 2" />
                <p>Av. Visc. de Jequitinhonha, 1145 - Boa Viagem, Recife - PE, 51030-021</p>
              </div>
          <div className="card">
              <img src={unidade3} alt="Imagem 3" />
              <p>Avenida Dom Luís, 10 - Fortaleza, Ceará</p>
            </div>
          </div>
        </section>
  
        <section className="secaohome" id="planos">
        <h2 className='h2home'> PLANOS</h2>
  
        <div className="plan-selector">
          <label htmlFor="plan">Escolha um plano: </label>
          <select id="plan" onChange={handlePlanChange} value={selectedPlan}>
            <option value="mensal">Plano Mensal</option>
            <option value="trimestral">Plano Trimestral</option>
            <option value="semestral">Plano Semestral</option>
            <option value="anual">Plano Anual</option>
          </select>
        </div>
  
        <div className="plan-price">
          <p>Preço: <span id="price">{price}</span></p>
        </div>
  
        <div className="card-container" id="plan-cards">
          {planCards}
        </div>
      </section>

  
        <section className="secaohome" id="contato">
          <div className="social-icons">
          <a href="#" target="_blank">
            <FontAwesomeIcon className='icone' icon={faInstagram} />
          </a>

          <a href="#" target="_blank">
            <FontAwesomeIcon className='icone' icon={faTwitter} />
          </a>

          <a href="#" target="_blank">
            <FontAwesomeIcon className='icone' icon={faFacebook} />
          </a>

          </div>
        </section>
            
        </div>
    );
}

export default Home;