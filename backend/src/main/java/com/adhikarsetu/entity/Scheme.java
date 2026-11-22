package com.adhikarsetu.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "schemes")
public class Scheme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) private String slug;
    @Column(nullable = false) private String name;
    private String category;
    private String level;
    @Column(length = 3000) private String description;
    @Column(length = 1500) private String benefit;
    private Integer annualValue;
    @Column(length = 2000) private String howToApply;
    @Column(length = 1500) private String documents;
    @Column(length = 1500) private String eligibility;
    @Column(length = 800) private String rulesNote;
    private String deadline;
    private String officialUrl;
    private LocalDate lastVerified;
    private Boolean verified;
    private Integer minAge;
    private Integer maxAge;
    private Integer maxIncome;
    private String occupations;
    private String gender;
    private String area;
    private Boolean requiresLand;
    private Boolean requiresDisability;
    private Boolean active;

    public Long getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBenefit() { return benefit; }
    public void setBenefit(String benefit) { this.benefit = benefit; }
    public Integer getAnnualValue() { return annualValue; }
    public void setAnnualValue(Integer annualValue) { this.annualValue = annualValue; }
    public String getHowToApply() { return howToApply; }
    public void setHowToApply(String howToApply) { this.howToApply = howToApply; }
    public String getDocuments() { return documents; }
    public void setDocuments(String documents) { this.documents = documents; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getRulesNote() { return rulesNote; }
    public void setRulesNote(String rulesNote) { this.rulesNote = rulesNote; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }
    public LocalDate getLastVerified() { return lastVerified; }
    public void setLastVerified(LocalDate lastVerified) { this.lastVerified = lastVerified; }
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public Integer getMinAge() { return minAge; }
    public void setMinAge(Integer minAge) { this.minAge = minAge; }
    public Integer getMaxAge() { return maxAge; }
    public void setMaxAge(Integer maxAge) { this.maxAge = maxAge; }
    public Integer getMaxIncome() { return maxIncome; }
    public void setMaxIncome(Integer maxIncome) { this.maxIncome = maxIncome; }
    public String getOccupations() { return occupations; }
    public void setOccupations(String occupations) { this.occupations = occupations; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Boolean getRequiresLand() { return requiresLand; }
    public void setRequiresLand(Boolean requiresLand) { this.requiresLand = requiresLand; }
    public Boolean getRequiresDisability() { return requiresDisability; }
    public void setRequiresDisability(Boolean requiresDisability) { this.requiresDisability = requiresDisability; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
