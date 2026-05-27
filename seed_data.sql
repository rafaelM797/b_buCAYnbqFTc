DELETE FROM estadisticas;
DELETE FROM becas;
DELETE FROM users;

INSERT INTO users (id, email, password_hash, full_name, role, active) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin@gestorbecas.com', '$2b$12$R9h7cIPz0giMbt8OfBc.zu.A4PKm8bpH0W5vH5f.N8Y/LZ4R9fXem', 'Administrador', 'admin', true),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'usuarioP@gestorbecas.com', '$2b$12$R9h7cIPz0giMbt8OfBc.zu.A4PKm8bpH0W5vH5f.N8Y/LZ4R9fXem', 'Usuario Prueba', 'user', true);

INSERT INTO becas (id, nombre, descripcion, monto_total, cantidad_disponibles, requisitos, activa) 
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001'::uuid, 'Beca Completa 2026', 'Cobertura completa', 50000000, 10, 'Promedio > 4.0', true),
  ('660e8400-e29b-41d4-a716-446655440002'::uuid, 'Beca de Transporte', 'Cobertura transporte', 3000000, 30, 'Vivir a +30km', true),
  ('660e8400-e29b-41d4-a716-446655440003'::uuid, 'Beca de Alimentación', 'Cobertura alimentación', 5000000, 25, 'Situación económica', true);

INSERT INTO estadisticas (id, total_estudiantes, total_solicitudes, solicitudes_aprobadas, becas_activas) 
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001'::uuid, 500, 490, 480, 50);
