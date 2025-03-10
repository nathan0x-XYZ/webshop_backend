export default function Test() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>測試頁面</h1>
      <p>如果您能看到這個頁面，說明部署成功了！</p>
      <p>生成時間: {new Date().toISOString()}</p>
    </div>
  );
}
