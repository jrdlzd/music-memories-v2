import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Reviewed } from './pages/Reviewed';
import { Pending } from './pages/Pending';
import { Tens } from './pages/Tens';
import { Admin } from './pages/Admin';
import { ProjectDetail } from './pages/ProjectDetail';
import { Login } from './pages/Login';

function App() {
return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* The Layout component wraps all these routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reviewed" element={<Reviewed />} />
            <Route path="reviewed/:id" element={<ProjectDetail />} />
            <Route path="tens" element={<Tens />} />
            <Route path="tens/:tens_id" element={<Tens />} />
            <Route path="pending" element={<Pending />} />
            <Route path="admin" element={<ProtectedRoute />}>
              <Route index element={<Admin />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;