import mariadb from "mariadb";

/** 매개변수 Interface */
interface QueryParams {
  [key: string]: any;
}

/** IP주소 */
const DB_HOST: string = process.env.DB_HOST!;
/** 사용자명 */
const DB_USER: string = process.env.DB_USER!;
/** 비밀번호 */
const DB_PASSWORD: string = process.env.DB_PASSWORD!;
/** 데이터베이스명 */
const DB_NAME: string = process.env.DB_NAME!;
/** 포트 번호 */
const DB_PORT: number = Number(process.env.DB_PORT!);

/** MariaDB 풀 */
const pool = mariadb.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  connectionLimit: 10,
});

/**
 * MariaDB에 SQL 쿼리를 실행하는 함수
 * @param sql - 실행할 SQL 쿼리
 * @param params - 쿼리 매개변수
 * @returns 쿼리 실행 결과
 */
export const query = async (
  sql: string,
  params?: QueryParams
): Promise<any> => {
  let connection: mariadb.PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const result = await connection.query(sql, params);

    return result;
  } catch (err: any) {
    console.error("Database query 오류입니다. :", err.message);

    throw new Error("Database query 실패했습니다.");
  } finally {
    if (connection) await connection.release(); // 연결 종료
  }
};
