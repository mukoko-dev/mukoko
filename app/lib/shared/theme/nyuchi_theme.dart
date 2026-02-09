import 'package:flutter/material.dart';
import '../../core/constants.dart';

class NyuchiTheme {
  static ThemeData light() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(MukokoColors.tanzaniteLight),
        brightness: Brightness.light,
      ),
      fontFamily: 'PlusJakartaSans',
      appBarTheme: const AppBarTheme(centerTitle: false),
    );
  }

  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(MukokoColors.tanzaniteLight),
        brightness: Brightness.dark,
      ),
      fontFamily: 'PlusJakartaSans',
      appBarTheme: const AppBarTheme(centerTitle: false),
    );
  }
}
