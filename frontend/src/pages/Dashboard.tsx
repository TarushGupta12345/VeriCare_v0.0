
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [bills, setBills] = useState([
    {
      id: "BILL-001",
      patientName: "John Smith",
      billAmount: "$15,420.00",
      potentialSavings: "$3,850.00",
      status: "Under Review",
      submittedDate: "2024-01-15",
    },
    {
      id: "BILL-002",
      patientName: "Sarah Johnson",
      billAmount: "$8,750.00",
      potentialSavings: "$1,200.00",
      status: "Negotiated",
      submittedDate: "2024-01-12",
    },
    {
      id: "BILL-003",
      patientName: "Michael Brown",
      billAmount: "$22,100.00",
      potentialSavings: "$6,630.00",
      status: "In Progress",
      submittedDate: "2024-01-10",
    },
    {
      id: "BILL-004",
      patientName: "Emily Davis",
      billAmount: "$5,300.00",
      potentialSavings: "$900.00",
      status: "Completed",
      submittedDate: "2024-01-08",
    },
  ]);

  useEffect(() => {
    const state = location.state as {
      analysis?: string;
      rawText?: string;
      patientName?: string;
    } | null;

    if (state?.analysis) {
      setAnalysisResult(state.analysis);
      // Prepend a simple bill entry so the table reflects the new analysis
      setBills((prev) => [
        {
          id: `BILL-${prev.length + 1}`,
          patientName: state.patientName || "Unknown",
          billAmount: "-",
          potentialSavings: "-",
          status: "Analyzed",
          submittedDate: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    }
  }, [location.state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-med-success bg-med-success/10";
      case "Under Review":
        return "text-med-amber bg-med-amber/10";
      case "In Progress":
        return "text-med-teal bg-med-teal/10";
      case "Negotiated":
        return "text-med-primary bg-med-primary/10";
      default:
        return "text-med-muted bg-med-gray";
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleUploadBill = () => {
    navigate("/upload-bill");
  };

  const totalSavings = bills.reduce((acc, bill) => {
    return acc + parseFloat(bill.potentialSavings.replace(/[$,]/g, ''));
  }, 0);

  return (
    <div className="min-h-screen bg-med-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-med-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-med-charcoal">MedBill AI Dashboard</h1>
                <p className="text-sm text-med-muted">Insurance Bill Analysis</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-med-primary text-med-primary hover:bg-med-primary hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-med-muted">Total Bills</p>
                <p className="text-2xl font-bold text-med-charcoal">{bills.length}</p>
              </div>
              <LayoutDashboard className="w-8 h-8 text-med-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-med-muted">Potential Savings</p>
                <p className="text-2xl font-bold text-med-success">${totalSavings.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-med-success/10 rounded-lg flex items-center justify-center">
                <span className="text-med-success font-bold">$</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-med-muted">In Progress</p>
                <p className="text-2xl font-bold text-med-teal">
                  {bills.filter(bill => bill.status === "In Progress" || bill.status === "Under Review").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-med-teal/10 rounded-lg flex items-center justify-center">
                <span className="text-med-teal font-bold">!</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-med-muted">Completed</p>
                <p className="text-2xl font-bold text-med-success">
                  {bills.filter(bill => bill.status === "Completed").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-med-success/10 rounded-lg flex items-center justify-center">
                <span className="text-med-success font-bold">✓</span>
              </div>
            </div>
          </Card>
        </div>

        {analysisResult && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-med-charcoal mb-2">Latest Bill Analysis</h2>
            <p className="whitespace-pre-wrap text-med-muted">{analysisResult}</p>
          </Card>
        )}

        {/* Bills Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-med-charcoal">Recent Bill Analysis</h2>
            <Button 
              onClick={handleUploadBill}
              className="bg-med-primary hover:bg-med-primary/90 text-white"
            >
              Upload New Bill
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Potential Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.patientName}</TableCell>
                  <TableCell>{bill.billAmount}</TableCell>
                  <TableCell className="text-med-success font-semibold">{bill.potentialSavings}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </TableCell>
                  <TableCell>{bill.submittedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
