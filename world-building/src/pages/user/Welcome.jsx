import { Link } from 'react-router-dom';
import '../../App.css'

const Welcome = ({ email }) => {
  return (
    <div>
      <h1>Bem-vindo!</h1>

      <Link to="/create-world"> {/* Atualizado para redirecionar para "/create-world" */}
        <button>Clique aqui para criar um mundo</button>
      </Link>

      <Link to="/world-list">
        <button>Ver Mundos Criados</button>
      </Link>
    </div>
  );
};

export default Welcome;
