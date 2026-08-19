import { useAuth } from "../../api/AuthProvider";
import UsersPanel from "../UsersPanel";

export default function UsuariosPage() {
  const { session, withAuth } = useAuth();
  if (!session) return null;

  return <UsersPanel currentUsuario={session.usuario} withAuth={withAuth} />;
}
