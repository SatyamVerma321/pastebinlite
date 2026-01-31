package com.example.pastebinlite.repository;
/**
Author:verma
Date : 27 Jan 2026
time :9:32:25 pm
*/

import com.example.pastebinlite.entity.Paste;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasteRepository extends JpaRepository<Paste, String> {
}
