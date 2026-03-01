package com.surveillance.engine.service;

import com.surveillance.engine.model.Transaction;
import com.surveillance.engine.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    public List<Transaction> getAll() {
        return repo.findAll();
    }

    public Optional<Transaction> getById(Long id) {
        return repo.findById(id);
    }

    public Transaction save(Transaction transaction) {
        return repo.save(transaction);
    }

    public Transaction update(Long id, Transaction updated) {
        updated.setId(id);
        return repo.save(updated);
    }
}