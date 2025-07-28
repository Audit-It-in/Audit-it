-- Drop existing tables if they exist
DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- Create simplified states table
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name),
    UNIQUE(code)
);

-- Create simplified districts table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, state_id) -- Unique district per state
);

-- Create indexes for better performance
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_districts_name ON districts(name);
CREATE INDEX idx_states_name ON states(name);
CREATE INDEX idx_states_code ON states(code);


-- Processing queue table removed - using local processing instead

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for states" ON states FOR SELECT USING (true);
CREATE POLICY "Public read access for districts" ON districts FOR SELECT USING (true);

-- Create RLS policies for service role
CREATE POLICY "Service role full access for states" ON states FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for districts" ON districts FOR ALL USING (auth.role() = 'service_role');

-- States and districts will be populated from CSV data only 