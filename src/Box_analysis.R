# Data for:
# Plot of phylogeny and cross ploidy per family

library(taxonlookup)
library(ape)
library(data.table)

# from Stace et al., Hybrid Flora of the British Isles
hybrid_flora <- fread("./data/HybridFlora230620.csv")

# get the proper columns
hybrid_flora_ploidy <- hybrid_flora[, .(
    # first parent
    PA = `Parent A`,
    # second parent
    PB = `Parent B`,
    # ploidies and chromosome numbers
    PlA = as.integer(`Ploidy A`),
    PlB = as.integer(`Ploidy B`),
    CNA = as.integer(`Chromosome number A`),
    CNB = as.integer(`Chromosome Number B`)
)][!is.na(PlA) | !is.na(PlB)]
# subset
cross_ploidy_hybrids <- hybrid_flora_ploidy[PA != PB][PlA != PlB]
# not sure I need this yet
# Richard thought this would be useful, so add into supplementary
fwrite(cross_ploidy_hybrids, "./data/203_CP_hybrids.csv")


same_ploidy_hybrids <- hybrid_flora_ploidy[PA != PB][PlA == PlB]
# create genus
cross_ploidy_hybrids[, Genus := gsub(" .*", "", PA)]
same_ploidy_hybrids[, Genus := gsub(" .*", "", PA)]

get_families <- data.table(
  Genus = taxonlookup::lookup_table(
    species_list = cross_ploidy_hybrids$Genus
  )[, 1],
  Family = taxonlookup::lookup_table(
    species_list = cross_ploidy_hybrids$Genus
  )[, 2]
)
get_families2 <- data.table(
  Genus = taxonlookup::lookup_table(
    species_list = same_ploidy_hybrids$Genus
  )[, 1],
  Family = taxonlookup::lookup_table(
    species_list = same_ploidy_hybrids$Genus
  )[, 2]
)


cross_ploidy_hybrids <- cross_ploidy_hybrids[get_families, on = .(Genus)]
## quick look at hybrids
# cross_ploidy_hybrids[, .(.N), by = .(Genus)][order(-N)]

same_ploidy_hybrids <- same_ploidy_hybrids[get_families2, on = .(Genus)]

crplhydist <- cross_ploidy_hybrids[, .(N = .N), by = .(Family)]
saplhydist <- same_ploidy_hybrids[, .(N = .N), by = .(Family)]

# From the UK Flora: https://doi.org/10.1073/pnas.2220261120
tree.3.stace4 <- read.tree(file = "./data/tree.3.stace4")
# get table of tip names and family
tips_and_fam <- data.table(Species = tree.3.stace4$tip.label)
tips_and_fam[, Genus := gsub("_.*", "", Species)]

get_families2 <- data.table(
  Genus = taxonlookup::lookup_table(species_list = tips_and_fam$Genus)[, 1],
  Family = taxonlookup::lookup_table(species_list = tips_and_fam$Genus)[, 2]
)

tree_families <- tips_and_fam[get_families2, on = .(Genus)]
rand_tips <- tree_families[, sample(Species, 1), by = .(Family)]

# keep only the tips of 1 per family
hundred_fam_tree <- ape::keep.tip(phy = tree.3.stace4, tip = rand_tips$V1)
# replace tip labels with respective families
hundred_fam_tree$tip.label <- rand_tips[
    match(hundred_fam_tree$tip.label, rand_tips$V1),
]$Family
# for aesthetics
hundred_fam_tree <- phytools::force.ultrametric(tree = hundred_fam_tree)

# associated data

hundred_fam_tree_fam <- data.table(Family = hundred_fam_tree$tip.label)

assoc_data <- crplhydist[hundred_fam_tree_fam, on = .(Family)]

colnames(assoc_data)[2] <- "N_cross"

assoc_data <- saplhydist[assoc_data, on = .(Family)]

colnames(assoc_data)[2] <- "N_same"

assoc_data[, `:=`(
    N_cross = ifelse(is.na(N_cross), 0, N_cross),
    N_same = ifelse(is.na(N_same), 0, N_same)
)]

# add proportions
assoc_data[, sum := N_same + N_cross][, `:=`(
    N_cross_prop = ifelse(is.nan(N_cross / sum), 0, N_cross / sum),
    N_same_prop = ifelse(is.nan(N_same / sum), 0, N_same / sum)
)]

# add number of ploidies per family
# from the BSBI cytology database
# specifically it's a combination of the Cytotype_variation and
# Ploidy_variation tabs here:
# https://docs.google.com/spreadsheets/d/1caUbJUGC7Q5V2k6JPB8xcgwRdnNvFHyZeMu1VUaTWO0/edit#gid=211453887
all_ploidies <- fread("./data/British_plant_ploidies.csv")

# multiple ploidies per species, let's extract those
all_ploidies <- all_ploidies[, .(
    Ploidy = unlist(strsplit(Ploidy, ",")),
    Genus,
    Family
), by = .(Species)]
# format them
all_ploidies[, Ploidy := gsub(pattern = " ", replacement = "", Ploidy)]
all_ploidies[, Ploidy := gsub(pattern = "\\(.*", replacement = "", Ploidy)]
all_ploidies[, Ploidy := gsub(pattern = "\\?", replacement = "", Ploidy)]

all_ploidies[, Ploidy := as.integer(Ploidy)]

all_ploidies_merge <- all_ploidies[
    , .(No_Ploidies = length(unique(Ploidy))),
    by = .(Family)
]

assoc_data_updat <- all_ploidies_merge[assoc_data, on = .(Family)]

assoc_data_updat[, No_Ploidies := ifelse(is.na(No_Ploidies), -1, No_Ploidies)]
# actual data for the plot!
fwrite(x = assoc_data_updat, file = "./data/Cross_ploidy_families.csv")
