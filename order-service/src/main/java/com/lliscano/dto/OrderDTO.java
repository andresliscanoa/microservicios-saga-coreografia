package com.lliscano.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private String transactionId;
    @NotBlank(message = "Required field")
    @Length(max = 255, message = "Maximum {255} characters")
    private String userId;

    @NotNull(message = "Required field")
    @Digits(integer=10, fraction=2)
    private Double amount;
}
