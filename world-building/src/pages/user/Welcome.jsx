

const Welcome = ({ email }) => {
  return (
    <div>
      <h1>Bem-vindo!</h1>
      <p>Olá, {email}</p>
    </div>
  );
};

export default Welcome;