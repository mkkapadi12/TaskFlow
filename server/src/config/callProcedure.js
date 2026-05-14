import pool from "./db.js";

const callProcedure = async (procedureName, params = []) => {
  const procedureQuery = `CALL ${procedureName}(${params
    .map(() => "?")
    .join(",")})`;

  try {
    const [rows] = await pool.query(procedureQuery, params);
    return rows;
  } catch (error) {
    console.error(`Error in procedure ${procedureName}:`, error.message);
    throw error;
  }
};

export default callProcedure;
