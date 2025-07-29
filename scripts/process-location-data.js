const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables from .env.local
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

// Use environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create service role client for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuration
const LOCATION_DATA_DIR = path.join(__dirname, "..", "location-data");
const BATCH_SIZE = 1000;

async function processLocationData() {
  console.log("🚀 Starting simplified location data import...");

  // Get CSV file
  const csvFiles = fs
    .readdirSync(LOCATION_DATA_DIR)
    .filter((file) => file.endsWith(".csv"))
    .sort();

  if (csvFiles.length === 0) {
    console.log("📁 No CSV files found in location-data directory");
    return;
  }

  const fileName = csvFiles[0]; // Process first CSV file
  const filePath = path.join(LOCATION_DATA_DIR, fileName);

  console.log(`📄 Processing file: ${fileName}`);

  // Read and parse CSV
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n").filter((line) => line.trim());

  console.log(`📊 Processing ${lines.length - 1} rows from ${fileName}`);

  // Parse CSV headers
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  console.log("📋 Headers:", headers);

  // Parse location data
  const locations = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));

    if (values.length >= 9) {
      const location = {
        statename: values[8] || "",
        district: values[7] || "",
      };

      if (location.statename && location.district) {
        locations.push(location);
      }
    }
  }

  console.log(`📍 Parsed ${locations.length} valid locations`);

  // Process states first
  const uniqueStates = new Map();
  locations.forEach((loc) => {
    const stateName = loc.statename.trim();
    if (stateName && !uniqueStates.has(stateName)) {
      // Create unique state code
      let stateCode = stateName.substring(0, 2).toUpperCase();
      let counter = 1;
      let originalCode = stateCode;

      // Check if code already exists in our map
      const existingCodes = Array.from(uniqueStates.values()).map((s) => s.code);
      while (existingCodes.includes(stateCode)) {
        stateCode = originalCode + counter;
        counter++;
      }

      uniqueStates.set(stateName, { name: stateName, code: stateCode });
    }
  });

  // Insert states
  const stateEntries = Array.from(uniqueStates.values());
  console.log(`🏛️  Processing ${stateEntries.length} unique states`);

  let statesProcessed = 0;
  for (const state of stateEntries) {
    // Check if state already exists
    const { data: existingState } = await supabase.from("states").select("id").eq("name", state.name).single();

    if (existingState) {
      console.log(`   ✅ State '${state.name}' already exists`);
    } else {
      const { error: stateError } = await supabase.from("states").insert([state]);

      if (stateError) {
        console.log(`   ⚠️  Failed to insert state '${state.name}': ${stateError.message}`);
      } else {
        statesProcessed++;
        console.log(`   ➕ Added new state: ${state.name}`);
      }
    }
  }

  // Get state IDs for districts
  const { data: statesData } = await supabase.from("states").select("id, name");

  const stateMap = new Map();
  statesData?.forEach((state) => {
    stateMap.set(state.name, state.id);
  });

  // Process districts
  const uniqueDistricts = new Map();

  locations.forEach((loc) => {
    const stateId = stateMap.get(loc.statename.trim());
    if (!stateId) return;

    const districtName = loc.district.trim();
    const districtKey = `${stateId}-${districtName}`;

    if (!uniqueDistricts.has(districtKey)) {
      uniqueDistricts.set(districtKey, {
        name: districtName,
        state_id: stateId,
      });
    }
  });

  // Insert districts
  const districtEntries = Array.from(uniqueDistricts.values());
  console.log(`🏘️  Processing ${districtEntries.length} unique districts`);

  let districtsProcessed = 0;
  for (const district of districtEntries) {
    // Check if district already exists
    const { data: existingDistrict } = await supabase
      .from("districts")
      .select("id")
      .eq("name", district.name)
      .eq("state_id", district.state_id)
      .single();

    if (existingDistrict) {
      console.log(`   ✅ District '${district.name}' already exists`);
    } else {
      const { error: districtError } = await supabase.from("districts").insert([district]);

      if (districtError) {
        console.log(`   ⚠️  Failed to insert district '${district.name}': ${districtError.message}`);
      } else {
        districtsProcessed++;
        console.log(`   ➕ Added new district: ${district.name}`);
      }
    }
  }

  console.log(`✅ Processing completed!`);
  console.log(`   States processed: ${statesProcessed}`);
  console.log(`   Districts processed: ${districtsProcessed}`);
}

// Run the process
processLocationData()
  .then(() => {
    console.log("🎉 Location data import completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error during import:", error);
    process.exit(1);
  });
