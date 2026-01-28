-- SQL Script para popular o banco de dados com dados de teste
-- Copie e execute no banco SQLite

-- ============================================
-- INSERIR BARBEARIAS
-- ============================================

INSERT INTO barbershops (id, name, phone, whatsapp_number, address, city, working_hours_start, working_hours_end)
VALUES 
  ('barbearia-central-001', 'Barbearia Central', '1133334444', '5511987654321', 'Rua Central, 123', 'São Paulo', '08:00', '18:00'),
  ('barbearia-premium-001', 'Barbearia Premium', '1144445555', '5511912345678', 'Av. Paulista, 456', 'São Paulo', '09:00', '19:00');

-- ============================================
-- INSERIR SERVIÇOS
-- ============================================

INSERT INTO services (id, barbershop_id, name, duration, price)
VALUES 
  -- Barbearia Central
  ('serv-001', 'barbearia-central-001', 'Corte de Cabelo', 30, 50.00),
  ('serv-002', 'barbearia-central-001', 'Barba', 20, 30.00),
  ('serv-003', 'barbearia-central-001', 'Corte + Barba', 50, 70.00),
  
  -- Barbearia Premium
  ('serv-004', 'barbearia-premium-001', 'Corte Premium', 45, 80.00),
  ('serv-005', 'barbearia-premium-001', 'Tratamento Capilar', 30, 60.00),
  ('serv-006', 'barbearia-premium-001', 'Barba Design', 25, 50.00);

-- ============================================
-- INSERIR DISPONIBILIDADE
-- ============================================

-- Barbearia Central (Seg-Dom: 0=Dom, 1=Seg, 6=Sab)
INSERT INTO availability (id, barbershop_id, day_of_week, start_time, end_time)
VALUES 
  -- Segunda a Sexta
  ('avail-001', 'barbearia-central-001', 1, '08:00', '18:00'),
  ('avail-002', 'barbearia-central-001', 2, '08:00', '18:00'),
  ('avail-003', 'barbearia-central-001', 3, '08:00', '18:00'),
  ('avail-004', 'barbearia-central-001', 4, '08:00', '18:00'),
  ('avail-005', 'barbearia-central-001', 5, '08:00', '20:00'),
  -- Sábado e Domingo
  ('avail-006', 'barbearia-central-001', 6, '09:00', '18:00'),
  ('avail-007', 'barbearia-central-001', 0, '09:00', '15:00');

-- Barbearia Premium (Seg-Dom)
INSERT INTO availability (id, barbershop_id, day_of_week, start_time, end_time)
VALUES 
  ('avail-008', 'barbearia-premium-001', 1, '09:00', '19:00'),
  ('avail-009', 'barbearia-premium-001', 2, '09:00', '19:00'),
  ('avail-010', 'barbearia-premium-001', 3, '09:00', '19:00'),
  ('avail-011', 'barbearia-premium-001', 4, '09:00', '19:00'),
  ('avail-012', 'barbearia-premium-001', 5, '09:00', '21:00'),
  ('avail-013', 'barbearia-premium-001', 6, '10:00', '19:00'),
  ('avail-014', 'barbearia-premium-001', 0, '10:00', '17:00');

-- ============================================
-- VERIFICAR DADOS INSERIDOS
-- ============================================

-- Contar barbearias
SELECT 'Barbearias' as tipo, COUNT(*) as total FROM barbershops;

-- Contar serviços
SELECT 'Serviços' as tipo, COUNT(*) as total FROM services;

-- Contar disponibilidades
SELECT 'Disponibilidades' as tipo, COUNT(*) as total FROM availability;

-- Listar barbearias com serviços
SELECT b.name as barbearia, s.name as servico, s.price as preco
FROM barbershops b
JOIN services s ON b.id = s.barbershop_id
ORDER BY b.name, s.name;

-- Listar horários de funcionamento
SELECT b.name as barbearia, 
       CASE day_of_week 
         WHEN 0 THEN 'Domingo'
         WHEN 1 THEN 'Segunda'
         WHEN 2 THEN 'Terça'
         WHEN 3 THEN 'Quarta'
         WHEN 4 THEN 'Quinta'
         WHEN 5 THEN 'Sexta'
         WHEN 6 THEN 'Sábado'
       END as dia,
       start_time as abre,
       end_time as fecha
FROM barbershops b
JOIN availability a ON b.id = a.barbershop_id
ORDER BY b.name, day_of_week;
