interface StockBarsProps {
  stock: number;
  maxStock?: number;
}

const StockBars = ({ stock, maxStock = 150 }: StockBarsProps) => {
  const ratio = Math.min(stock / maxStock, 1);
  const filled = ratio > 0.66 ? 3 : ratio > 0.33 ? 2 : stock > 0 ? 1 : 0;
  const color = filled === 1 ? '#ff4d4f' : filled === 2 ? '#faad14' : '#1677ff';

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 14,
            borderRadius: 2,
            background: i <= filled ? color : '#e8e8e8',
          }}
        />
      ))}
    </div>
  );
};

export default StockBars;