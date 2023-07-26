import { RouterProvider } from "react-router-dom";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./routes/Routes.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";
import CustomToast from "./widgets/CustomToast.tsx";

function App() {
  const isAuth = useAuthStore((store) => store.isAuth);

  return (
    <>
      {isAuth ? <RouterProvider router={PRIVATE_ROUTES} /> : <RouterProvider router={PUBLIC_ROUTES} />}
      <CustomToast />
    </>
  );
}

export default App;
