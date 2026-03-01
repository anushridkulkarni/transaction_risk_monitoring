package com.surveillance.engine.service;

import com.surveillance.engine.model.Transaction;
import com.surveillance.engine.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    public List<Transaction> getAll() {
        return repo.findAll();
    }

    public Optional<Transaction> getById(UUID id) {  // Long → UUID
        return repo.findById(id);
    }

    @Transactional
    public Transaction save(Transaction transaction) {
        return repo.save(transaction);
    }

    public Transaction update(UUID id, Transaction updated) {
        Optional<Transaction> existing = repo.findById(id);
        if (existing.isPresent()) {
            updated.setId(id);
            return repo.save(updated);
        }

        throw new RuntimeException("Transaction not found");
    }

    public List<Transaction> getByFromAccount(String fromAccount) {
        return repo.findByFromAccount(fromAccount);
    }
}