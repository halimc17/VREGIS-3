-- Insert 13 tim putri untuk tournament BEA PRO 17
-- Assumsi tournament_id untuk BEA PRO 17 - akan diupdate setelah cek

-- Cari tournament BEA PRO 17 terlebih dahulu
DO $$
DECLARE
    tournament_uuid UUID;
BEGIN
    -- Cari tournament BEA PRO 17
    SELECT id INTO tournament_uuid
    FROM tournaments
    WHERE name ILIKE '%BEA PRO 17%'
    LIMIT 1;

    -- Jika tournament ditemukan, insert tim-tim
    IF tournament_uuid IS NOT NULL THEN
        INSERT INTO teams (id, name, gender, tournament_id, created_at, updated_at) VALUES
        (gen_random_uuid(), 'Qubic', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Kencana Jaya', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Tunas', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Gracia', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Urban', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Gajah Mungkur', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Karuci', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'SKY', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Comet', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Bharata Muda', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'Pervina', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'JVC', 'putri', tournament_uuid, NOW(), NOW()),
        (gen_random_uuid(), 'VIKING', 'putri', tournament_uuid, NOW(), NOW());

        RAISE NOTICE 'Successfully added 13 putri teams to tournament %', tournament_uuid;
    ELSE
        RAISE NOTICE 'Tournament BEA PRO 17 not found';
    END IF;
END $$;