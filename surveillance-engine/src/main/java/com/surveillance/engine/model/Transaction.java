package com.surveillance.engine.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    private String fromAccount;
    private String toAccount;
    private Double amount;
    private String transactionType;
    private Integer riskScore = 0;
    private String status = "PENDING";
    private LocalDateTime createdAt = LocalDateTime.now();
}