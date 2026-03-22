package com.surveillance.engine.repository;

import com.surveillance.engine.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCustomerUsername(String customerUsername);
    List<Transaction> findByAssignedTo(String assignedTo);
}
