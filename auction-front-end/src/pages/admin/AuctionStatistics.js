import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AuctionStatistics = () => {
    const [chartData, setChartData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Mặc định là năm hiện tại
    const [totalAuctions, setTotalAuctions] = useState(0); // Tổng số phiên đấu giá trong năm

    useEffect(() => {
        fetchStatistics();
    }, [selectedYear]); // Gọi API mỗi khi năm thay đổi

    const fetchStatistics = () => {
        const token = localStorage.getItem("token");

        axios.get(`http://localhost:8080/api/admin/auction-statistics?year=${selectedYear}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const data = response.data; // API trả về {1: 10, 2: 15, ..., 12: 30}

                // Chuyển đổi dữ liệu API sang dạng biểu đồ
                let formattedData = [];
                let total = 0;

                for (let i = 1; i <= 12; i++) {
                    let count = data[i] || 0; // Nếu tháng không có dữ liệu, đặt mặc định là 0
                    formattedData.push({ name: `Tháng ${i}`, value: count });
                    total += count; // Tính tổng số đấu giá
                }

                setChartData(formattedData);
                setTotalAuctions(total);
            })
            .catch((error) => console.error("Lỗi khi lấy thống kê đấu giá:", error));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Tổng số phiên đấu giá trong năm</h2>

            {/*/!* Chọn năm thống kê *!/*/}
            {/*<div className="flex justify-center gap-4 mb-6">*/}
            {/*    <label className="text-lg">Chọn năm:</label>*/}
            {/*    <select*/}
            {/*        value={selectedYear}*/}
            {/*        onChange={(e) => setSelectedYear(e.target.value)}*/}
            {/*        className="p-2 border rounded-lg"*/}
            {/*    >*/}
            {/*        {[2022, 2023, 2024, 2025].map((year) => (*/}
            {/*            <option key={year} value={year}>{year}</option>*/}
            {/*        ))}*/}
            {/*    </select>*/}
            {/*</div>*/}

            {/* Tổng số phiên đấu giá */}
            <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-blue-600">{totalAuctions}</h3>
            </div>

            {/* Biểu đồ cột */}
            <div className="flex justify-center mb-6">
                <BarChart width={600} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </div>

            {/*/!* Biểu đồ đường *!/*/}
            {/*<div className="flex justify-center mb-6">*/}
            {/*    <LineChart width={600} height={300} data={chartData}>*/}
            {/*        <XAxis dataKey="name" />*/}
            {/*        <YAxis />*/}
            {/*        <Tooltip />*/}
            {/*        <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} />*/}
            {/*    </LineChart>*/}
            {/*</div>*/}

            {/*/!* Biểu đồ tròn *!/*/}
            {/*<div className="flex justify-center">*/}
            {/*    <PieChart width={300} height={300}>*/}
            {/*        <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">*/}
            {/*            {chartData.map((_, index) => (*/}
            {/*                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />*/}
            {/*            ))}*/}
            {/*        </Pie>*/}
            {/*        <Tooltip />*/}
            {/*        <Legend />*/}
            {/*    </PieChart>*/}
            {/*</div>*/}
        </div>
    );
};

export default AuctionStatistics;
