 const Card = ({ children }: { children: React.ReactNode }) => {
    const cardStyle = {
        padding: "5px",
        margin: "10px",
        borderRadius: "8px",
        width:"100%",
        height:"100%",
        color: "#ffffff",
    };

    return (
        <div style={cardStyle}>
            {children}
        </div>
    );
}

export default Card;
