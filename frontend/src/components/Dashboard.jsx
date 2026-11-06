import { PieChart, Pie, Tooltip, ResponsiveContainer, Sector } from 'recharts';

export default function Dashboard({ tareasCompletadas, tareasPendientes, dataGrafico }) {
  // Función para pintar las porciones del gráfico
  const renderSector = (props) => {
    const color = props.index === 0 ? '#10b981' : '#38bdf8'; 
    return <Sector {...props} fill={color} />;
  };

  return (
    <div className="dashboard-panel">
      <h2>Resumen de Tareas</h2>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataGrafico}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              shape={renderSector} 
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="leyenda-grafico">
        <span>🟢 Completadas: {tareasCompletadas}</span>
        <span>🔵 Pendientes: {tareasPendientes}</span>
      </div>
    </div>
  );
}