// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PayrollSystem {
    address public owner;
    uint256 public paymentInterval = 5 minutes;
    
    struct Employee {
        address payable walletAddress;
        uint256 salary;
        uint256 lastPayment;
        bool active;
    }
    
    mapping(address => Employee) public employees;
    address[] public employeeAddresses;
    
    event EmployeeAdded(address indexed employeeAddress, uint256 salary);
    event EmployeeRemoved(address indexed employeeAddress);
    event SalaryPaid(address indexed employeeAddress, uint256 amount);
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function addEmployee(address payable _employeeAddress, uint256 _salary) public onlyOwner {
        require(_employeeAddress != address(0), "Invalid address");
        require(_salary > 0, "Salary must be greater than 0");
        require(!employees[_employeeAddress].active, "Employee already exists");
        
        employees[_employeeAddress] = Employee({
            walletAddress: _employeeAddress,
            salary: _salary,
            lastPayment: block.timestamp,
            active: true
        });
        
        employeeAddresses.push(_employeeAddress);
        
        emit EmployeeAdded(_employeeAddress, _salary);
    }
    
    function removeEmployee(address _employeeAddress) public onlyOwner {
        require(employees[_employeeAddress].active, "Employee does not exist");
        
        employees[_employeeAddress].active = false;
        
        emit EmployeeRemoved(_employeeAddress);
    }
    
    function depositFunds() public payable onlyOwner {
        require(msg.value > 0, "Must deposit some funds");
        
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    function processPayroll() public {
        uint256 currentTime = block.timestamp;
        
        for (uint i = 0; i < employeeAddresses.length; i++) {
            address employeeAddress = employeeAddresses[i];
            Employee storage employee = employees[employeeAddress];
            
            if (employee.active && currentTime >= employee.lastPayment + paymentInterval) {
                uint256 paymentAmount = employee.salary;
                
                if (address(this).balance >= paymentAmount) {
                    employee.lastPayment = currentTime;
                    employee.walletAddress.transfer(paymentAmount);
                    
                    emit SalaryPaid(employeeAddress, paymentAmount);
                }
            }
        }
    }
    
    function withdrawSalary() public {
        Employee storage employee = employees[msg.sender];
        require(employee.active, "Employee does not exist or is not active");
        
        uint256 currentTime = block.timestamp;
        require(currentTime >= employee.lastPayment + paymentInterval, "Cannot withdraw yet");
        
        uint256 paymentAmount = employee.salary;
        require(address(this).balance >= paymentAmount, "Contract does not have enough funds");
        
        employee.lastPayment = currentTime;
        employee.walletAddress.transfer(paymentAmount);
        
        emit SalaryPaid(msg.sender, paymentAmount);
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getEmployeeCount() public view returns (uint256) {
        return employeeAddresses.length;
    }
    
    function getEmployeeDetails(address _employeeAddress) public view returns (uint256 salary, uint256 lastPayment, bool active) {
        Employee memory employee = employees[_employeeAddress];
        return (employee.salary, employee.lastPayment, employee.active);
    }
}