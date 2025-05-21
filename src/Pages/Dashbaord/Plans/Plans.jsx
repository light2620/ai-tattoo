import "./style.css";

const Plans = () => {
  const plans = [
    {
      name: "Plan A",
      url: "planA.com",
      creditScore: 100,
      amount: "$9.99",
      borderColor: "#3498db", // blue
    },
    {
      name: "Plan B",
      url: "planB.com",
      creditScore: 250,
      amount: "$19.99",
      borderColor: "#27ae60", // green
    },
    {
      name: "Plan C",
      url: "planC.com",
      creditScore: 500,
      amount: "$29.99",
      borderColor: "#e67e22", // orange
    },
  ];

  return (
    <div className="plans-container">
      {plans.map((plan, index) => (
        <div
          className="plan-card"
          key={index}
          style={{ borderTop: `1em solid ${plan.borderColor}` }}
        >
          <h2>{plan.name}</h2>
          <p><strong>URL:</strong> <a href={plan.url}>{plan.url}</a></p>
          <p><strong>Credit Score:</strong> {plan.creditScore}</p>
          <p><strong>Amount:</strong> {plan.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default Plans;
