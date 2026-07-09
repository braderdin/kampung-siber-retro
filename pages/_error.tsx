function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>An Error Occurred</h1>
      {statusCode ? <p>Status Code: {statusCode}</p> : <p>An error occurred</p>}
    </div>
  );
}

export default Error;