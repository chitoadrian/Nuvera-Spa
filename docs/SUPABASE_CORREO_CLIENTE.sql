-- Ejecutar una sola vez en el SQL Editor del proyecto Supabase de Nuvéra Spa.
-- La columna queda nullable para conservar sin cambios las reservas existentes.
alter table public.citas
  add column if not exists correo_cliente text;

comment on column public.citas.correo_cliente is
  'Correo de contacto exigido por la API para reservas nuevas; nullable para datos históricos.';
