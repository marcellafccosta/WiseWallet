import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import AppHeader from "../components/Header";

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
  });
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const idUsuario = localStorage.getItem("idusuario");
        const token = localStorage.getItem("token");

        if (!idUsuario || !token) {
          alert("Usuário não está autenticado!");
          return;
        }

        const response = await axios.get(`http://localhost:3000/usuario/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuario(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        alert("Não foi possível carregar os dados do usuário.");
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleSave = async () => {
    try {
      const idUsuario = localStorage.getItem("idusuario");
      const token = localStorage.getItem("token");

      const payload = {
        nome: usuario.nome,
        email: usuario.email,
        senhaAtual: senhaAtual || undefined,
        senhaNova: senhaNova || undefined,
      };

      const response = await axios.put(`http://localhost:3000/usuario/${idUsuario}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Dados atualizados com sucesso!");
        setEditMode(false);
        setSenhaAtual("");
        setSenhaNova("");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      alert("Não foi possível atualizar os dados. Verifique os campos e tente novamente.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <AppHeader />
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
        <h2>Perfil do Usuário</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Nome:</label>
          <Input
            name="nome"
            value={usuario.nome}
            disabled={!editMode}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Email:</label>
          <Input
            type="email"
            name="email"
            value={usuario.email}
            disabled={!editMode}
            onChange={handleChange}
          />
        </div>
        {editMode && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Senha Atual:</label>
              <Input.Password
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Nova Senha:</label>
              <Input.Password
                value={senhaNova}
                onChange={(e) => setSenhaNova(e.target.value)}
                placeholder="Digite a nova senha"
              />
            </div>
          </>
        )}
        <div style={{ textAlign: "center" }}>
          {!editMode ? (
            <Button type="primary" onClick={() => setEditMode(true)}>
              Editar
            </Button>
          ) : (
            <Button type="primary" onClick={handleSave}>
              Salvar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
